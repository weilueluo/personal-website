output "cluster_name" {
    value = aws_ecs_cluster.v3.name
}
output "service_name" {
    value = aws_ecs_service.v3.name
}
output "service_security_group_id" {
    value = aws_security_group.v3_ecs_service.id
}
