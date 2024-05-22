param (
    [string]$task
)

function Start-Django {
    Write-Host "Запуск сервера Django"
    Set-Location -Path "./avby"
    if (Test-Path ".\.venv\Scripts\activate") {
        .\.venv\Scripts\activate
        python manage.py runserver
    } else {
        Write-Host "Не удалось найти виртуальное окружение"
        exit 1
    }
}

function Start-Chat{
    Write-Host "Запуск сервера FastAPI"
    Set-Location -Path "./avby"
    if (Test-Path ".\.venv\Scripts\activate") {
        .\.venv\Scripts\activate
        uvicorn avby.asgi:application --port 8080 --reload
        docker run 
    } else {
        Write-Host "Не удалось найти виртуальное окружение"
        exit 1
    }
}

function Start-React {
    Write-Host "Запуск сервера React"
    Set-Location -Path "./avby-front"
    npm run dev
}

function Start-FastAPI {
    Write-Host "Запуск сервера FastAPI"
    Set-Location -Path "./avby-fastapi"
    uvicorn main:app --reload
}

function Start-All {
    Start-Job -ScriptBlock { Start-Django }
    Start-Job -ScriptBlock { Start-React }
    Start-Job -ScriptBlock { Start-FastAPI }
    Get-Job | Wait-Job
}

switch ($task) {
    "django" { Start-Django }
    "react" { Start-React }
    "fastapi" { Start-FastAPI }
    "chat" { Start-Chat }
    "all" { Start-All }
    default { Write-Host "Неизвестная задача: $task" }
}