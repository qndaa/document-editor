# Document editor

## Pokretanje projekta
### Frontend
U 'client' direktorijumu potrebno je uneti
```
npm i
npm start
```
kako bi se servirala klijentska aplikacija. Napomena je da je neophodno imati instaliran node na sistemu pre pokretanja.

### Backend
Za ovu aplikaciju preporucujemo pokretanje u okviru okruzenja. Prerekvizit je da sistem ima instaliran python interpreter.
Prvo je potrebno preuzeti model i smestiti ga u prediction folder pod nazivom 'model.pth'. Model je moguce preuzeti sa linka: shorturl.at/eivC8
<br>Nakon aktivacije okruzenja potrebno je instalirati pip pakete uz pomoc:
```
pip install -r requirements.txt
```
nakon cega se projekat pokrece sa:
```
FLASK_APP = app.py
FLASK_ENV = development
FLASK_DEBUG = 0
python -m flask run
```
na Windows-u, ili na ostalim operativnim sistemima:
```
FLASK_APP = app.py
FLASK_ENV = development
FLASK_DEBUG = 0
flask run
```
