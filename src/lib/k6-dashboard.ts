import { Duration, aws_cloudwatch } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface K6DashboardProps { namespace: string };

export class K6Dashboard extends aws_cloudwatch.Dashboard {
  constructor(scope: Construct, id: string, props: K6DashboardProps) {
    const { namespace } = props;
    super(scope, id, {
      widgets: [
        [
          new aws_cloudwatch.GraphWidget({
            title: "Virtual Users",
            period: Duration.seconds(1),
            width: 12,
            height: 6,
            left: [
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_vus",
                dimensionsMap: { metric_type: "gauge" },
              }),
            ],
          }),
          new aws_cloudwatch.GraphWidget({
            title: "RPS",
            period: Duration.seconds(1),
            width: 12,
            height: 6,
            left: [
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_reqs",
                dimensionsMap: {
                  metric_type: "counter",
                },
              }),
            ],
          }),
        ],
        [
          new aws_cloudwatch.GraphWidget({
            title: "Response Times",
            period: Duration.seconds(1),
            stacked: true,
            width: 12,
            height: 6,
            left: [
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_req_sending",
                dimensionsMap: {
                  metric_type: "timing",
                },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_req_receiving",
                dimensionsMap: {
                  metric_type: "timing",
                },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_req_tls_handshaking",
                dimensionsMap: {
                  metric_type: "timing",
                },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_req_waiting",
                dimensionsMap: {
                  metric_type: "timing",
                },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_req_connecting",
                dimensionsMap: {
                  metric_type: "timing",
                },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_http_req_blocked",
                dimensionsMap: {
                  metric_type: "timing",
                },
              }),
            ],
          }),
          new aws_cloudwatch.GraphWidget({
            title: "Iterations",
            period: Duration.seconds(1),
            width: 6,
            height: 6,
            left: [
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_iteration_duration",
                dimensionsMap: { metric_type: "timing" },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_iterations",
                dimensionsMap: { metric_type: "counter" },
              }),
            ],
          }),
          new aws_cloudwatch.GraphWidget({
            title: "Data Transfer",
            period: Duration.seconds(1),
            width: 6,
            height: 6,
            left: [
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_data_sent",
                dimensionsMap: { metric_type: "counter" },
              }),
              new aws_cloudwatch.Metric({
                namespace,
                metricName: "k6_data_received",
                dimensionsMap: { metric_type: "counter" },
              }),
            ],
          }),
        ],
      ],
    });
  }
}
