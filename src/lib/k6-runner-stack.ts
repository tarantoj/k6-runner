import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { K6TaskDefinition } from './k6-task-definition';
import { K6Dashboard } from './k6-dashboard';

export class K6RunnerStack extends cdk.Stack {
  readonly taskDef: cdk.aws_ecs.ITaskDefinition;
  readonly dashboard: cdk.aws_cloudwatch.Dashboard;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const namespace = "k6";

    this.taskDef = new K6TaskDefinition(this, "K6TaskDefinition", { namespace })
    this.dashboard = new K6Dashboard(this, "K6Dashboard", { namespace })

    new cdk.CfnOutput(this, "TaskDefinition", { value: this.taskDef.taskDefinitionArn });
    new cdk.CfnOutput(this, "Dashboard", { value: this.dashboard.dashboardArn });
  }
}
