import { Message } from 'amqplib';
import {
	ERROR_CODES,
	ERROR_MESSAGES,
	TRANSACTION_TYPE,
} from '../constant/constants';
import { ReturnedError, ReturnedResponse } from '../data classes';
import logger from '../lib/logger';
import dbService from '../service/db.service';
import rabbitmqService from '../service/rabbitmq.service';
// types not available need to implement own
const abiDecoder = require('abi-decoder');

export class ContractTxLogsDecoder {
	static instance: ContractTxLogsDecoder | null = null;

	constructor() {
		if (!ContractTxLogsDecoder.instance)
			ContractTxLogsDecoder.instance = this;
		return ContractTxLogsDecoder.instance;
	}

	static getInstance = () => new ContractTxLogsDecoder();

	oldTxnConsumer = async (message: Message | null) => {
		if (!message) return;
		try {
			const data = JSON.parse(message.content.toString('utf-8'));
			const decodingLogs = await this.decodeTransactions(data.contractAddress);
			console.log('Decoding all logs', decodingLogs);

			rabbitmqService.ackMessage(message);
			if (decodingLogs.error) throw decodingLogs.error;
		} catch (err: any) {
			console.log('errorr oldTxnConsumer', err);
			logger.error(ERROR_MESSAGES.TRANSACTIONS_LOGS);
			logger.error(err.message);
		}
	};

	newTxnConsumer = async (message: Message | null) => {
		if (!message) return;
		try {
			const data = JSON.parse(message.content.toString('utf-8'));
			const decodingLogs = await this.decodeTransaction(data.txHash);
			console.log('Decoding new log', decodingLogs);

			rabbitmqService.ackMessage(message);
			if (decodingLogs.error) throw decodingLogs.error;
		} catch (err: any) {
			console.log('errorr newTxnConsumer', err);
			logger.error(ERROR_MESSAGES.DECODING_TRANSACTION);
			logger.error(err.message);
		}
	};

	decodeTransactions = async (contractAddress: any) => {
		try {
			const whereCondition = {
				AND: [
					{
						OR: [
							{ toAddress: contractAddress },
							{
								contractAddress,
							},
						],
					},
					{
						OR: [
							{ type: TRANSACTION_TYPE.CONTRACT_TRANSFER },
							{ type: TRANSACTION_TYPE.CONTRACT_CREATION },
						],
					},
				],
			};

			const contractOldTransactions =
				await dbService.prisma.transactions.count({
					where: whereCondition,
				});

			const iteration = Math.floor(contractOldTransactions / 100) + 1;
			let offset = 0;

			const contractDetails: any =
				await dbService.prisma.contractVerification.findUnique({
					where: {
						contractAddress,
					},
				});

			if (!contractDetails || !contractDetails.abi)
				return new ReturnedResponse(ERROR_MESSAGES.ABI_NOT_FOUND, null);

			for (let iterator = 1; iterator <= iteration; iterator += 1) {
				const contractTxRecords: any =
					await dbService.prisma.transactions.findMany({
						where: whereCondition,
						take: 100,
						include: {
							ContractLogs: true,
						},
						skip: offset === 0 ? offset : offset,
					});
				offset += 100;
				const contractTxDecoded: any = [];
				if (contractTxRecords.length) {
					contractTxRecords.forEach((contractTx: any) => {
						abiDecoder.addABI(JSON.parse(contractDetails.abi));
						const decodedInput =
							contractTx.input &&
								contractTx.type !==
								TRANSACTION_TYPE.CONTRACT_CREATION
								? abiDecoder.decodeMethod(contractTx.input)
								: '';
						let decodedLogs = [];
						try {
							decodedLogs = contractTx.ContractLogs[0]
								? abiDecoder.decodeLogs(
									JSON.parse(
										contractTx.ContractLogs[0].logs,
									),
								)
								: '';
						} catch (err) {
							console.log('Error in decodedTransactions');
							const abis = JSON.parse(contractDetails.abis);
							for (const abi of abis) {
								if (!decodedLogs.length) {
									abiDecoder.addABI(abi);
									decodedLogs = contractTx.ContractLogs[0]
										? abiDecoder.decodeLogs(
											JSON.parse(contractTx.ContractLogs[0].logs),
										)
										: '';
								}
							}
							contractTxDecoded.push({
								txHash: contractTx.txhash,
								contractAddress,
								input: JSON.stringify(decodedInput),
								logs: JSON.stringify(decodedLogs),
							});
						}
					});
					await dbService.prisma.decodedLogs.createMany({
						data: contractTxDecoded,
						skipDuplicates: true
					});
				}
			}

			return new ReturnedResponse('', true);
		} catch (err) {
			return new ReturnedResponse(
				'',
				null,
				new ReturnedError(err),
				ERROR_CODES.LOGS_DECODING,
			);
		}
	};

	decodeTransaction = async (txHash: any) => {
		try {
			const contractTxRecord: any =
				await dbService.prisma.transactions.findUnique({
					where: { txhash: txHash },
					include: {
						ContractLogs: true,
					},
				});

			if (!contractTxRecord)
				return new ReturnedResponse(ERROR_MESSAGES.TXN_NOT_FOUND, null);
			const contractDetails: any =
				await dbService.prisma.contractVerification.findUnique({
					where: {
						contractAddress: contractTxRecord.toAddress,
					},
				});

			if (!contractDetails || !contractDetails.abi)
				return new ReturnedResponse(ERROR_MESSAGES.ABI_NOT_FOUND, null);
			abiDecoder.addABI(JSON.parse(contractDetails.abi));

			const decodedInput =
				contractTxRecord.input &&
					contractTxRecord.type !== TRANSACTION_TYPE.CONTRACT_CREATION
					? abiDecoder.decodeMethod(contractTxRecord.input)
					: '';

			let decodedLogs = [];
			try {
				decodedLogs = contractTxRecord.ContractLogs[0]
					? abiDecoder.decodeLogs(
						JSON.parse(contractTxRecord.ContractLogs[0].logs),
					)
					: '';
			} catch (err) {
				console.log('Error in decodedTransaction');
				const abis = JSON.parse(contractDetails.abis);
				for (const abi of abis) {
					if (!decodedLogs.length) {
						abiDecoder.addABI(abi);
						decodedLogs = contractTxRecord.ContractLogs[0]
							? abiDecoder.decodeLogs(
								JSON.parse(contractTxRecord.ContractLogs[0].logs),
							)
							: '';
					}
				}

				await dbService.prisma.decodedLogs.createMany({
					data: {
						txHash: contractTxRecord.txhash,
						contractAddress: contractTxRecord.toAddress,
						input: JSON.stringify(decodedInput),
						logs: JSON.stringify(decodedLogs),
					},
					skipDuplicates: true
				});
			}
			return new ReturnedResponse('', true);
		} catch (err) {
			return new ReturnedResponse(
				'',
				null,
				new ReturnedError(err),
				ERROR_CODES.LOGS_DECODING,
			);
		}
	};
}
