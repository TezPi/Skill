"""Run a command only after the declared motion plan passes its phase gate."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
from validate_plan import validate


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase',choices=['edit','export'],required=True)
    parser.add_argument('plan',type=Path)
    parser.add_argument('command',nargs=argparse.REMAINDER)
    args=parser.parse_args()
    command=args.command[1:] if args.command[:1]==['--'] else args.command
    if not command:parser.error('Supply a command after --.')
    try:
        plan=json.loads(args.plan.read_text(encoding='utf-8-sig'))
        report=validate(plan)
    except (OSError,ValueError,TypeError) as exc:
        print(json.dumps({'blocked':True,'reason':str(exc)},ensure_ascii=False));return 2
    if not report.get('ready_to_'+args.phase):
        print(json.dumps({'blocked':True,'phase':args.phase,'report':report},ensure_ascii=False,indent=2));return 3
    if isinstance(plan,dict) and isinstance(plan.get('task'),dict) and plan['task'].get('deliverable')=='plan':
        print(json.dumps({'blocked':True,'reason':'A plan-only request does not authorize a media editing/export command.'}));return 4
    try:return subprocess.run(command,shell=False,check=False).returncode
    except OSError as exc:
        print(json.dumps({'command_failed':True,'reason':str(exc)},ensure_ascii=False));return 127


if __name__=='__main__':
    raise SystemExit(main())
