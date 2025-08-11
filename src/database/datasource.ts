import { DataSource, DataSourceOptions } from 'typeorm';
import typeormConfig from '../config/typeorm.config';

// nécessaire pour les migrations
const dataSource = new DataSource(typeormConfig as DataSourceOptions);

export default dataSource;

dataSource.initialize();
