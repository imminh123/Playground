"""
PydanticAI agent with tools and streaming responses.
This example tests if AI can stream text before making tool calls.
"""
import asyncio
from collections.abc import AsyncIterable
from datetime import date
import asyncio
import os
from pydantic_ai import (
    Agent,
    AgentStreamEvent,
    FinalResultEvent,
    FunctionToolCallEvent,
    FunctionToolResultEvent,
    PartDeltaEvent,
    PartStartEvent,
    PartEndEvent,
    RunContext,
    TextPartDelta,
    ThinkingPartDelta,
    ToolCallPartDelta,
)
from dataclasses import dataclass

# Configure LiteLLM proxy
os.environ["OPENAI_BASE_URL"] = "http://127.0.0.1:23009"
os.environ["OPENAI_API_KEY"] = "sk-1234"


# Define some example tools for the agent
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    # Simulated weather data
    weather_data = {
        "london": "Cloudy, 15�C",
        "paris": "Sunny, 18�C",
        "new york": "Rainy, 12�C",
        "tokyo": "Clear, 20�C",
    }
    return weather_data.get(city.lower(), f"Weather data not available for {city}")


def calculate_sum(a: float, b: float) -> float:
    """Calculate the sum of two numbers."""
    return a + b


def search_database(query: str) -> str:
    """Search a database for information."""
    # Simulated database search
    results = {
        "python": "Python is a high-level programming language.",
        "ai": "AI stands for Artificial Intelligence.",
        "pydantic": "Pydantic is a data validation library using Python type annotations.",
    }
    return results.get(query.lower(), f"No results found for '{query}'")


# Create the agent with tools
agent = Agent(
    "openai:gpt-4.1",
    tools=[get_weather],
    system_prompt=(
        "You are a helpful assistant. When answering questions, provide some "
        "explanation or context before using tools. Stream your thoughts and "
        "reasoning as you work through the problem."
    ),
)

@dataclass
class WeatherService:
    async def get_forecast(self, location: str, forecast_date: date) -> str:
        # In real code: call weather API, DB queries, etc.
        return f'The forecast in {location} on {forecast_date} is 24°C and sunny.'

    async def get_historic_weather(self, location: str, forecast_date: date) -> str:
        # In real code: call a historical weather API or DB
        return f'The weather in {location} on {forecast_date} was 18°C and partly cloudy.'


weather_agent = Agent[WeatherService, str](
    'openai:gpt-5',
    deps_type=WeatherService,
    output_type=str,  # We'll produce a final answer as plain text
    system_prompt='Providing a weather forecast at the locations the user provides.',
)


@weather_agent.tool
async def weather_forecast(
    ctx: RunContext[WeatherService],
    location: str,
    forecast_date: date,
) -> str:
    if forecast_date >= date.today():
        return await ctx.deps.get_forecast(location, forecast_date)
    else:
        return await ctx.deps.get_historic_weather(location, forecast_date)


output_messages: list[str] = []


async def main():
    user_prompt = 'What will the weather be like in Paris on Tuesday? Notify user before calling the tool.'

    # Begin a node-by-node, streaming iteration
    async with weather_agent.iter(user_prompt, deps=WeatherService()) as run:
        async for node in run:
            if Agent.is_user_prompt_node(node):
                # A user prompt node => The user has provided input
                output_messages.append(f'=== UserPromptNode: {node.user_prompt} ===')
            elif Agent.is_model_request_node(node):
                # A model request node => We can stream tokens from the model's request
                output_messages.append('=== ModelRequestNode: streaming partial request tokens ===')
                async with node.stream(run.ctx) as request_stream:
                    final_result_found = False
                    async for event in request_stream:
                        if isinstance(event, PartStartEvent):
                            output_messages.append(f'[Request] Starting part {event.index}: {event.part!r}')
                            if hasattr(event.part, 'content') and event.part.content:
                                print(event.part.content, end='', flush=True)
                        if isinstance(event, PartEndEvent):
                            output_messages.append(f'[Request] Starting part {event.index}: {event.part!r}')
                            if hasattr(event.part, 'content') and event.part.content:
                                print("Part end event")
                        elif isinstance(event, PartDeltaEvent):
                            if isinstance(event.delta, TextPartDelta):
                                output_messages.append(
                                    f'[Request] Part {event.index} text delta: {event.delta.content_delta!r}'
                                )
                                print(event.delta.content_delta, end='', flush=True)
                            elif isinstance(event.delta, ToolCallPartDelta):
                                output_messages.append(
                                    f'[Request] Part {event.index} args delta: {event.delta.args_delta}'
                                )
               
            elif Agent.is_call_tools_node(node):
                # A handle-response node => The model returned some data, potentially calls a tool
                output_messages.append('=== CallToolsNode: streaming partial response & tool usage ===')
                async with node.stream(run.ctx) as handle_stream:
                    async for event in handle_stream:
                        if isinstance(event, FunctionToolCallEvent):
                            output_messages.append(
                                f'[Tools] The LLM calls tool={event.part.tool_name!r} with args={event.part.args} (tool_call_id={event.part.tool_call_id!r})'
                            )
                            print(f'\n [Tools] The LLM calls tool={event.part.tool_name!r} with args={event.part.args} (tool_call_id={event.part.tool_call_id!r})')   

                        elif isinstance(event, FunctionToolResultEvent):
                            output_messages.append(
                                f'[Tools] Tool call {event.tool_call_id!r} returned => {event.result.content}'
                            )
            # elif Agent.is_end_node(node):
            #     # Once an End node is reached, the agent run is complete
            #     assert run.result is not None
            #     assert run.result.output == node.data.output
            #     output_messages.append(f'=== Final Agent Output: {run.result.output} ===')
            #     print(f'{run.result.output}')

if __name__ == '__main__':
    asyncio.run(main())

    # print(output_messages)
    """
    [
        '=== UserPromptNode: What will the weather be like in Paris on Tuesday? ===',
        '=== ModelRequestNode: streaming partial request tokens ===',
        "[Request] Starting part 0: ToolCallPart(tool_name='weather_forecast', tool_call_id='0001')",
        '[Request] Part 0 args delta: {"location":"Pa',
        '[Request] Part 0 args delta: ris","forecast_',
        '[Request] Part 0 args delta: date":"2030-01-',
        '[Request] Part 0 args delta: 01"}',
        '=== CallToolsNode: streaming partial response & tool usage ===',
        '[Tools] The LLM calls tool=\'weather_forecast\' with args={"location":"Paris","forecast_date":"2030-01-01"} (tool_call_id=\'0001\')',
        "[Tools] Tool call '0001' returned => The forecast in Paris on 2030-01-01 is 24°C and sunny.",
        '=== ModelRequestNode: streaming partial request tokens ===',
        "[Request] Starting part 0: TextPart(content='It will be ')",
        '[Result] The model started producing a final result (tool_name=None)',
        '[Output] It will be ',
        '[Output] It will be warm and sunny ',
        '[Output] It will be warm and sunny in Paris on ',
        '[Output] It will be warm and sunny in Paris on Tuesday.',
        '=== CallToolsNode: streaming partial response & tool usage ===',
        '=== Final Agent Output: It will be warm and sunny in Paris on Tuesday. ===',
    ]
    """