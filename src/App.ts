import http from 'http';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import registerRoutes from './routes';

export default class App {
	public expressApp: express.Application;
	public httpServer: http.Server;
	public enableMorganMiddleware = environment.apiLogsEnable;

	public async init(): Promise<void> {
		this.expressApp = express();
		this.httpServer = http.createServer(this.expressApp);

		// add all global middleware like cors
		this.middleware();

		// register the all routes
		this.routes();
	}

	/**
	 * here register your all routes
	 */
	private routes(): void {
		this.expressApp.use('/', registerRoutes());
	}

	/**
	 * here you can apply your middlewares
	 */
	private middleware(): void {
		this.expressApp.use(cors());
		// support application/json type post data
		// support application/x-www-form-urlencoded post data
		// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
		this.expressApp.use(
			helmet({
				contentSecurityPolicy: false,
				crossOriginEmbedderPolicy: false,
			}),
		);
	}
}
