# SmartShop Backend (Flask)

Run locally:
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
export FLASK_APP=wsgi.py
flask run --debug
```

See root `README.md` for API docs and deployment.