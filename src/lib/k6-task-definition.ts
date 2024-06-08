import { aws_ecs, aws_iam, aws_logs } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";


export type K6TaskDefinitionProps = (aws_ecs.FargateTaskDefinition & { namespace: string }) | { namespace: string }

export class K6TaskDefinition extends aws_ecs.FargateTaskDefinition {
  constructor(scope: Construct, id: string, props: K6TaskDefinitionProps) {
    const { namespace, ...taskDefProps } = props
    super(scope, id, taskDefProps)

    this.taskRole.addManagedPolicy((
      aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
        "CloudWatchAgentServerPolicy"
      )
    ))

    this.addContainer("K6", {
      image: aws_ecs.ContainerImage.fromAsset(
        join(__dirname, ".", "k6-docker")
      ),
      logging: aws_ecs.LogDriver.awsLogs({
        streamPrefix: "k6",
        logRetention: aws_logs.RetentionDays.ONE_WEEK,
      }),
      essential: true,
    })

    this.addContainer("CloudwatchAgent", {
      image: aws_ecs.ContainerImage.fromRegistry(
        "amazon/cloudwatch-agent:latest"
      ),

      essential: true,
      environment: {
        CW_CONFIG_CONTENT: JSON.stringify({
          metrics: {
            namespace,
            metrics_collected: {
              statsd: {
                service_address: ":8125",
                metrics_collection_interval: 5,
                metrics_aggregation_interval: 0,
              },
            },
          },
        }),
      },
    });

  }
}
