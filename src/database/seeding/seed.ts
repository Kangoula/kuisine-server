import typeormConfig from '../../config/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

const dataSource = new DataSource(typeormConfig as DataSourceOptions);

dataSource.initialize().then(async () => {
  await runSeeders(dataSource, {
    seeds: ['dist/database/seeding/**/*.seeder{.ts,.js}'],
    factories: ['dist/database/seeding/factories/**/*.factory{.ts,.js}'],
  });
});
