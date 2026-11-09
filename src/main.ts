import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Membuat instansiasi aplikasi NestJS menggunakan modul utama (AppModule)
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan ValidationPipe secara global untuk mengvalidasi DTO pada setiap request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus properti yang tidak didefinisikan dalam DTO dari payload request
      forbidNonWhitelisted: true, // Melempar error (BadRequestException) jika ada properti tak terdaftar di DTO
      transform: true, // Otomatis mengonversi payload request ke tipe data yang sesuai dengan DTO
    }),
  );

  // Menentukan port server dari environment variable PORT atau menggunakan default 3000
  const port = process.env.PORT || 3000;
  
  // Memulai server HTTP dan mendengarkan request pada port yang ditentukan
  await app.listen(port);
  console.log(`API berjalan di http://localhost:${port}`);
}

// Memanggil fungsi bootstrap untuk menjalankan aplikasi
bootstrap();