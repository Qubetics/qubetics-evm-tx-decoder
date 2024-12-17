export const STATUS_CODES = {
	SUCCESS: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NOCONTENT: 204,
	BADREQUEST: 400,
	UN_AUTHORIZED: 401,
	FORBIDDEN: 403,
	NOTFOUND: 404,
	TIMEOUT: 408,
	TOO_MANY_REQ: 429,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BADGATEWAYS: 502,
	SERVICEUNAVILABLE: 503,
	GATEWAYTIMEOUT: 504,
	MULTIPLE_CHOICES: 300,
};

export const COMPILATION_TYPE = {
	SINGLE_FILE: 'solidity-single-file',
	MULTI_FILE: 'solidity-multi-part-files',
	JSON_STANDARD_INPUT: 'solidity-standard-json-input',
};

export const ERROR_MESSAGES = {
	INVALID_CONTRACT_ADDRESS: 'Invalid contract address.',
	INTERNAL_SERVER_ERROR:
		'Something went wrong, please again after some time.',
	FILE_REQUIRED: 'File required',
	NODE_RPC_CONNECTION: 'Node rpc request failed',
	ERROR_WHILE_SERVICES_SETUP: 'Error while services setup.',
	WORKER_NOT_FOUND: 'Worker not found with following name.',
	NULL_WORKER_MESSAGE: 'Message cant be null',
	ENV_NOT_FOUND:
		'Env file is missing from root directory and envs not loaded into runtime',
	TABLE_NOT_FOUND: 'Table not found.',
	SOL_JSON_FILE_ONLY: 'Only SOL and JSON files are allowed!',
	RABBITMQ_CHANNEL_NULL: 'Channel is null',
	RABBITMQ: 'The RabbitMQ error is',
	TRANSACTIONS_LOGS:
		'\x1b[31mError while decoding the transaction logs\x1b[0m',
	DECODING_TRANSACTION: '\x1b[31mError while decoding the transaction\x1b[0m',
	ABI_NOT_FOUND: 'ABI not found',
	TXN_NOT_FOUND: 'Transaction not found',
};

export const RATE_LIMITER_MESSAGE = {
	TOO_MANY_REQUEST:
		'You are doing too many request. Please try again in 5 minutes.',
	WINDOW_MS: 5 * 60 * 1000, // 5 minutes  600000, // 10 minutes in milliseconds
	MAX: 20, // 20 request in 10 minutes
};
export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const RES_MSG = {
	VERIFY_CONTRACT_SUCCESS: 'contract verified successfully',
	VERIFY_CONTRACT_FETCH_SUCCESS: 'verified contracts fetched successfully',
	VERIFY_CONTRACT_FETCH_ERROR: 'verified contracts not found',
	CONTRACT_NOT_FOUND: 'contract not found',
	CONTRACT_TX_NOT_FOUND: 'contract transaction not found',
	CONTRACT_ALREADY_VERIFIED_ERROR: 'contract already verified',
	CONTRACT: 'contract fetched successfully',
	ABI: 'abi fetched successfully',
	WIDGET: 'widget fetched successfully',
	CONTRACT_TX: 'conract transaction fetched successfully',
	ERROR: 'Oops! Something went wrong. Please try again.',
	SERVER_ERROR: 'internal server error',
	TRANSACTION_NOT_FOUND: 'transaction not found',
	TRANSACTION_FETCH_SUCCESS: 'transaction fetched successfully',
	SUCCESS: 'Success',
	CONTRACT_VERIFICATION_UNDER_PROCESS:
		'Contract verification under process, please check after some time.',
	DATA_INSERTED_IN_QUEUE_SUCCESS: 'data inserted to queue',
	COMPILER_TYPE_FETCH_SUCCESS: 'compiler type fetched successfully',
	COMPILER_VERSION_FETCH_SUCCESS: 'compiler version fetched successfully',
	RPC_NODE_REQ_SUCCESS: 'RPC request success',
	LICENSE_TYPE_FETCH_SUCCESS: 'license type fetched successfully',
	CONTRACT_VERIFICATION_PROCESSED: 'Contract verification processed.',
	BYTECODE_NOT_FOUND_ON_CHAIN: 'Unable to locate ContractCode at',
	REDIS_CONNECTION_SUCCESS: 'Redis connected successfully',
	REDIS_CONNECTION_FAILED: 'Redis connection failed',
	REDIS_CONNECTION_CLOSED: 'Redis connection closed successfully',
	REDIS_CONNECTION_NOT_CLOSED:
		'Connection not closed, something went wrong while closing the connection',
	RABBITMQ_CONNECTION_SUCCESS: 'Rabbitmq connected successfully',
	RABBITMQ_CONNECTION_FAILED: 'Rabbitmq connection failed',
	RABBITMQ_CONNECTION_CLOSED: 'RabbitMq connection closed successfully',
	DATABASE_CONNECTION_SUCCESS: 'Database connected successfully',
	DATABASE_CONNECTION_FAILED: 'Database connection failed',
	DATABASE_CONNECTION_CLOSED: 'Database connection closed successfully',
	STANDARD_JSON_INPUT_FAILED: 'Error while converting to standard json input',
	SOURCES_CANTBE_NULL: 'Sources can not be null or undef.',
	SOURCES_CANTBE_EMPTY: 'Sources can not be empty.',
	SOURCES_TYPE: 'Sources need to be instance of object',
};

export const BLOCKCHAIN_MSG = {
	GET_BALANCE_ERROR: 'error occured while fetching balance detail',
	BYTECODE_NOT_FOUND: 'Deployed bytecode is not found.',
	SUCCESS: 'Success',
	BLOCKCHAIN_NOT_CONNECTED: 'Blockchain not connected',
	BLOCKCHAIN_CONNECTED: 'Blockchain connected successfully',
	ERROR: 'Error while checking blockchain connection',
	ERROR_LOOP: 'Error in connection checking loop',
};

export const CONST_NAME = {
	POWER: 10 ** 18,
};
export const RABBITMQ_QUEUES = {
	TRANSACTION_LOGS_DECODING: 'TRANSACTION_LOGS_DECODING',
	DECODE_NEW_TRANSACTION: 'DECODE_NEW_TRANSACTION',
};
export enum TRANSACTION_TYPE {
	COIN_TRANSFER = 'COIN_TRANSFER',
	CONTRACT_CREATION = 'CONTRACT_CREATION',
	CONTRACT_TRANSFER = 'CONTRACT_TRANSFER',
}

export const VALIDATION_TYPE = {
	VERIFY_SINGLE_FILE:
		'file is not required when code format is solidity-single-file',
	FILE_NOT_REQUIRED: 'file is not required',
	VERIFY_JSON_INPUT_FILE:
		'file is required when code format is solidity-multi-part-files',
	INVALID_PAGE_NUMBER: 'invalid page number',
	ADDRESS_FORMAT: 'should start with 0x',
	ADDRESS_LENGTH: 'length should be equal to 42',
	ADDRESS_AVOID_SPACE: 'should not start with space',
	VALID_VALUE: 'should be a valid value',
	INVALID_LIMIT: 'invalid limit',
	REQUIRED_LIMIT: 'limit is required',
};

export const COMPILER_TYPE = [
	'solidity-single-file',
	'solidity-multi-part-files',
	'solidity-standard-json-input',
];

export const LICENSE_TYPE = [
	'No License (None)',
	'The Unlicense (Unlicense)',
	'MIT License (MIT)',
	'GNU General Public License v2.0 (GNU GPLv2)',
	'GNU General Public License v3.0 (GNU GPLv3)',
	'GNU Lesser General Public License v2.1 (GNU LGPLv2.1)',
	'GNU Lesser General Public License v3.0 (GNU LGPLv3)',
	'BSD 2-clause "Simplified" license (BSD-2-Clause)',
	'BSD 3-clause "New" Or "Revised" license* (BSD-3-Clause)',
	'Mozilla Public License 2.0 (MPL-2.0)',
	'Open Software License 3.0 (OSL-3.0)',
	'Apache 2.0 (Apache-2.0)',
	'GNU Affero General Public License (GNU AGPLv3)',
	'Business Source License (BSL 1.1)',
];
// codes for specfic parts failure
export const ERROR_CODES = {
	REDIS_CONNECTION: 100,
	DATABASE_CONNECTION: 101,
	RABBIT_MQ_CONNECTION: 102,
	REDIS_STORING: 103,
	DATABASE_CRUD: 104,
	CONTRACT_COMPILATION: 105,
	RPC_REQUEST: 106,
	CRITICAL_DATA_MISSING: 107,
	ENV_LOAD_FAILURE: 108,
	RABBITMQ_CONNECTION_CLOSE: 109,
	DATABASE_CONNECTION_CLOSE: 110,
	REDIS_CONNECTION_CLOSE: 111,
	RABBITMQ_QUEUE_INSERT: 112,
	RABBITMQ_QUEUE_CREATION: 113,
	CONTRACT_VERIFICATION: 114,
	LOGS_DECODING: 115,
};

export const TABLE_NAME = {
	CONTRACT_VERIFICATION: 'ContractVerification',
};

export const VERIFICATION_TYPE = {
	INITIAL: -2,
	REJECTED: -1,
	PENDING: 0,
	PARTIAL_VERIFIED: 1,
	FULLY_VERIFIED: 2,
};

export const CONTRACT_VERIFICATION_STATUS = {
	REJECTED: 'Fail - Unable to verify',
	PENDING: 'Pending in queue',
	VERIFIED: 'Pass - Verified',
};

export const TOOLS_VERIFICATION_STATUS_CODE = {
	SUCCESS: 1,
};

export const STATUS = {
	SUCCESS: 'SUCCESS',
};
