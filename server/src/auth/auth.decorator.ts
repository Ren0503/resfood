import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const loggedInUser = gqlContext['user']['user'];
        return loggedInUser;
    }
)
