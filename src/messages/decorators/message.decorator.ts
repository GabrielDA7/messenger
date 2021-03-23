import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const MessageDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.message;
    },
);
