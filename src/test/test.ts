import Environment from '../environments/environment';
import { setGlobalEnvironment } from '../global';
import web3Helper from '../helper/web3.helper';
import { ContractTxLogsDecoder } from '../queue-consumers';
import DatabaseClient from '../service/db.service';

const env = new Environment();
setGlobalEnvironment(env);
web3Helper.run();
DatabaseClient.run();
const queueConsumer = new ContractTxLogsDecoder();

describe(' Contract Verification API', () => {
	test('DECODING OLD TXNS - QUEUE CONSUMER', async () => {
		const contractAddress = '0x3a9a2409914283AcD3F441795ddf210A0a88C8Ae';
		await queueConsumer.decodeTransactions(contractAddress);
		const data = await DatabaseClient.prisma.decodedLogs.count({
			where: { contractAddress },
		});
		expect(data).toBeGreaterThan(0);
	});

	test('DECODING OLD TXNS - QUEUE CONSUMER', async () => {
		const txHash =
			'0xfd5c2576609886d7184e5963dcbc30a0cba0565f2a01b82baae3a5b90150e7b8';
		await queueConsumer.decodeTransaction(txHash);
		const data = await DatabaseClient.prisma.decodedLogs.count({
			where: { txHash },
		});
		expect(data).toBeGreaterThan(0);
	});
});
