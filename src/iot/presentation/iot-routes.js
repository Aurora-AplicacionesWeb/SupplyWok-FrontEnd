const iotAlertsView = () => import('./views/alerts-view.vue');

const iotRoutes = [
  { path: '/iot/alerts', name: 'restaurant-alerts', component: iotAlertsView, meta: { i18nKey: 'shared.titles.alerts', role: 'restaurant' } },
  { path: '/iot/alerts/:alertId/view', name: 'iot-alerts-view', component: iotAlertsView, meta: { i18nKey: 'shared.titles.alerts', role: 'restaurant' } }
];

export default iotRoutes;
