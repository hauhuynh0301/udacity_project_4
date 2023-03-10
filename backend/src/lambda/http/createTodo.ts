import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { TodoItem } from '../../models/TodoItem'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const userId: string = getUserId(event)
      const todoItem: TodoItem = await createTodo(userId, newTodo)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ item: todoItem })
      }
    }catch (error) {
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error })
  };
}
  })

handler.use(
  cors({
    credentials: true
  })
)
