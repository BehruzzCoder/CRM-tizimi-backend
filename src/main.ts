import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as bcrypt from "bcrypt";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({origin: true, credentials: true});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads",
  });

  const config = new DocumentBuilder()
    .setTitle("CRM API")
    .setDescription("CRM backend API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
  const  password = "buyukzamon";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);

  await app.listen(3000, "0.0.0.0");
}
bootstrap();  