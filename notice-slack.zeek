@load base/frameworks/notice

module Notice;

export {
    redef enum Action += {
        ACTION_SLACK,
    };

    # Needs to be redefined to match your Slack Incoming Webhook URL
    const slack_webhook_url = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" &redef;
    # Can be redefined to add a different public channel, username and emoji
    const slack_channel = "" &redef;
    const slack_username = "Zeek" &redef;
    const slack_emoji = ":eyes:" &redef;
}
