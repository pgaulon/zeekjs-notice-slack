'use strict';
const https = require('node:https');

var slack_webhook_url = zeek.global_vars['Notice::slack_webhook_url'];
var slack_channel = zeek.global_vars['Notice::slack_channel'];
var slack_username = zeek.global_vars['Notice::slack_username'];
var slack_emoji = zeek.global_vars['Notice::slack_emoji'];

function slack_json_payload(notice, channel, username, emoji) {
    let text = `${notice.note}: ${notice.msg}`;
    if (notice.sub) {
        text += `, (${notice.sub})`;
    }
    if (notice.id && notice.id.orig_h && notice.id.orig_p && notice.id.resp_h && notice.id.resp_p) {
        text += `, Connection: ${notice.id.orig_h}:${notice.id.orig_p} -> ${notice.id.resp_h}:${notice.id.resp_p}`
    }
    if (notice.uid) {
        text += `, Connection uid: ${notice.uid}`
    }
    if (notice.src) {
        text += `, Source: ${notice.src}`;
    }
    let slack_message = {
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

    let req = https.request(webhook, requestOptions, (res) => {
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

zeek.hook('Notice::policy', (notice) => {
    if ( notice.actions.includes('Notice::ACTION_SLACK') ) {
        slack_send_notice(slack_webhook_url, slack_json_payload(notice, slack_channel, slack_username, slack_emoji));
    }
});
