# Start Borgs
SET MIND_QUEUE=MINDBORG1&&SET HTTP_PORT=3001&& npm run borg
SET MIND_QUEUE=MINDBORG2&&SET HTTP_PORT=3002&& npm run borg
SET MIND_QUEUE=MINDBORG3&&SET HTTP_PORT=3003&& npm run borg

Delete All Keys In Redis

Delete all keys from all Redis databases:

$ redis-cli FLUSHALL

Delete all keys of the currently selected Redis database:

$ redis-cli FLUSHDB

Delete all keys of the specified Redis database:

$ redis-cli -n <database_number> FLUSHDB