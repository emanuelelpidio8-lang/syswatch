from fastapi import FastAPI
from system import get_system_info

app = FastAPI(title="Mini Monitor API")


@app.get("/api/system")
def read_system():
    """Endpoint que devolve os dados do sistema em JSON."""
    return get_system_info()