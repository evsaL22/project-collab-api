import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { MembersModule } from './members/members.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    // Mengaktifkan konfigurasi global (.env) agar bisa diakses di seluruh aplikasi
    ConfigModule.forRoot({ isGlobal: true }),

    // Konfigurasi koneksi database PostgreSQL secara asynchronous menggunakan TypeORM & ConfigService
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'project_collab_db'),
        autoLoadEntities: true, // Otomatis mendeteksi entity dari modul-modul lain
        synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true', // Sinkronisasi otomatis skema DB (sebaiknya false di production)
      }),
    }),

    // Modul-modul fitur utama aplikasi
    ProjectsModule,
    MembersModule,
    ProjectMembersModule,
    TasksModule,
    CommentsModule,
    FilesModule,
  ],
})
export class AppModule {}