/*
 * pisy
 * https://github.com/connectid/pispy
 *
 */

// have hostabd running
// run as root
// sudo nohup hostapd /etc/hostapd/hostapd.conf &
// sudo nohup node pispy.js > pispy.log &

"use strict";
var spawn = require('child_process').spawn,
    ssid= 'elepi',
    iface= 'mon.wlan0',
    sniffer = spawn( 'tcpdump',[ '-el','-i',iface]);

sniffer.stderr.setEncoding('utf8');
sniffer.stderr.on('data', function(data) {
    data = data.trim();
//	console.log( 'stderr', data.length, data );
});
sniffer.stdout.setEncoding('utf8');
// wait for client ready message before proceeding
sniffer.stdout.on('data', function( msg ) {
    msg = msg.trim();
//16:38:28.438852 1.0 Mb/s 2457 MHz 11g -77dB signal antenna 1 BSSID:Broadcast DA:Broadcast SA:90:b9:31:43:f1:59 (oui Unknown) Probe Request () [1.0 2.0 5.5 11.0 Mbit]
//    var probe = msg.match(/BSSID:(.{17}).*DA:(.{17}).*Probe.Response.\(eleway\).*/);
    var probe = msg.match(/-(.*?)dB.*SA:(.{17}).*Probe.Request.\((.*?)\).*/);
    if ( probe) {
        // log time,snr,mac and network looking for
        console.log(new Date(), probe[1],probe[2],probe[3]);
    } else {
//        console.log( 'stdout', msg.length, msg );
    }
});