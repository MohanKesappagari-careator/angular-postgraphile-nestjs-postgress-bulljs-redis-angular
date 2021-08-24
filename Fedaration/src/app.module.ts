import { Module } from '@nestjs/common';
import { GraphQLGatewayModule } from '@nestjs/graphql';
import FileUploadDataSource from '@profusion/apollo-federation-upload';

@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      server: {
        cors: true,
      },
      gateway: {
        buildService: () =>
          new FileUploadDataSource({
            url: 'http://localhost:3000/graphql',
            useChunkedTransfer: true,
          }),
        serviceList: [
          { name: 'student', url: 'http://localhost:9000/graphql' },
        ],
      },
    }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
