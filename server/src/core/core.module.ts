import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

const pubsub: PubSub = new PubSub();

@Global()
@Module({
    providers: [{ provide: 'PUB_SUB', useValue: pubsub }],
    exports: ['PUB_SUB'],
})
export class CoreModule {}
