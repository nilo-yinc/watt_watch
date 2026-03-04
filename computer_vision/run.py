import os
import uvicorn

if __name__ == "__main__":
    # Local default keeps CV loop enabled; Render should set RUN_CV=0.
    os.environ.setdefault("RUN_CV", "1")

    uvicorn.run(
        "app.api.server:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=False,
    )
