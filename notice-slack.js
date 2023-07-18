'use strict';
const https = require('node:https');

var slack_webhook_url = zeek.global_vars['Notice::slack_webhook_url'];
var slack_channel = zeek.global_vars['Notice::slack_channel'];
var slack_username = zeek.global_vars['Notice::slack_username'];
var slack_emoji = zeek.global_vars['Notice::slack_emoji'];

function slack_json_payload(notice, channel, username, emoji) {
    var text = `${notice.note}: ${notice.msg}`;
    if ('sub' in notice) {
        text += ` (${notice.sub})`;
    }
    if ('id' in notice) {
        text += `, Connection: ${notice.id.orig_h}:${notice.id.orig_p} -> ${notice.id.resp_h}:${notice.id.resp_p}`
        if ('uid' in notice) {
            text += `, Connection uid: ${notice.uid}`
        }
    }
    else if ('src' in notice) {
        text += `, Source: ${notice.src}`;
    }
    var slack_message = {
        text: text,
        channel: channel,
        username: username,
        icon_emoji: emoji
    };
    return JSON.stringify(slack_message);
}

function slack_send_notice(webhook, json_payload) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = https.request(webhook, requestOptions, (res) => {
        let response = '';
        res.on('data', (d) => {
            response += d;
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.write(json_payload);
    req.end();
}

zeek.hook('Notice::Info', (notice) => {
    if ( ACTION_SLACK in notice.actions ) {
        slack_send_notice(slack_webhook_url, slack_json_payload(notice, slack_channel, slack_username, slack_emoji));
    }
});
