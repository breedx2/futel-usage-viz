cat ~/Downloads/metrics/metrics* | grep 'CHANNEL=SIP/660' | grep 'name=hold_the_phone_main' | grep -v 'hold_the_phone_main_conversations'
cat ~/Downloads/metrics/metrics* | grep -E 'name=peoples_homes|conversations|missed_connections' | grep -v '_info' | grep -v 'missed_connections_listen' | grep -v 'hold_the_phone_main_conversations'
cat ~/Downloads/metrics/metrics* | grep 'hold_the_phone_incoming'
