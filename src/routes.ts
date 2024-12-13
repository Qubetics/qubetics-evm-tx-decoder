import { Router } from 'express';
import { STATUS_CODES } from './constant/constants';

/**
 * Here, you can register routes by instantiating the controller.
 *
 */
export default function registerRoutes(): Router {
	const router = Router();
	router.use('/status', (req, res) => {
		res.json({ message: 'Service is up and running.' });
	});

	// restrict all routes
	router.all('*', (req, res) => {
		res.status(STATUS_CODES.NOT_IMPLEMENTED).json({
			route: 'route not supported.',
		});
	});

	return router;
}
