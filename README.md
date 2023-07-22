# zeekjs-notice-slack
Add [Zeek Notice](https://docs.zeek.org/en/master/frameworks/notice.html) via [Slack webhooks](https://api.slack.com/messaging/webhooks) using [ZeekJS](https://zeekjs.readthedocs.io/en/latest/)

# Usage

## Installation

Using [zkg](https://docs.zeek.org/projects/package-manager/en/stable/index.html)
```
zkg install zeekjs-notice-slack
```

## Configuration

```
vagrant@ubuntu-kinetic:~$ tail -n8 /opt/zeek/share/zeek/site/local.zeek
@load ./zeekjs-notice-slack
redef Notice::slack_webhook_url = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
redef Notice::slack_emoji = ":eyes:";
redef Notice::slack_username = "Zeek";
hook Notice::policy(n: Notice::Info)
{
    add n$actions[Notice::ACTION_SLACK];
}
```

# Testing

## System preparation

- Using [Ubuntu 22.10 Vagrantfile](https://app.vagrantup.com/ubuntu/boxes/kinetic64)
- Installing [Zeek via packages](https://build.opensuse.org/package/binaries/security:zeek/zeek/xUbuntu_22.10) and dependencies
- Installing [ZeekJS](https://github.com/corelight/zeekjs#building) via zkg and dependencies
- Installing this script

```
$ git clone https://github.com/pgaulon/zeekjs-notice-slack
$ cd zeekjs-notice-slack
$ sudo /opt/zeek/bin/zkg install .
```

## Pcap preparation

Using HTTP SQLi to generate notices via the [detect-sql.zeek policy](https://github.com/zeek/zeek/blob/master/scripts/policy/protocols/http/detect-sqli.zeek)
```
# shell 1
$ sudo tcpdump -s0 -w /tmp/sqli.pcap -i any "port 4444"

# shell 2
python3 -m http.server 4444

# shell 3
sqlmap --url "http://127.0.0.1:4444/?aaa=1" -p aaa
```

## Test

Sending Slack messages
```
$ /opt/zeek/bin/zeek -C -r /tmp/sqli.pcap /opt/zeek/share/zeek/site/local.zeek
```
