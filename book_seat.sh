export SUDO_ASKPASS=/usr/local/bin/password.sh
export NODE_PATH=/usr/local/lib/node_modules/ 

/usr/local/bin/node /_your_path_to_the_scripts/BookSeat.js

options="sudo pmset schedule wake " 
datestr=$(date +"%m/%d/%Y 09:00:00")
totalstr="$options \"$datestr\""
echo $totalstr
eval $totalstr
