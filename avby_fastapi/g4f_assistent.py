from g4f import ChatCompletion, Provider

async def send_message(messages) -> str:
    try:
        response = await ChatCompletion.create_async(
            model= 'gpt-3.5-turbo',
            messages= [
                {'role': 'system', 'content': 'Ты ассистен для помощи'},
                {'role': 'user', 'content': messages}],
            provider=Provider.DuckDuckGo,
        )
    except Exception as e:
        print(e)
        return None
    
    return response