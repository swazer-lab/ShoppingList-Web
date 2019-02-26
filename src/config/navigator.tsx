import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export const navigator = (routes: any) => {
	const appRoutes = Object.keys(routes).map((route: any) => {
		if (!routes.hasOwnProperty(route)) return;

		const { path, page, options } = routes[route];
		return <Route key={path} path={path} component={page} {...options} />;
	});

	return (
		<BrowserRouter>
			<Switch>
				{appRoutes}
			</Switch>
		</BrowserRouter>
	);
};
