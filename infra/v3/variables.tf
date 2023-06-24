# variable "lb_account_id" {
#   type = string
# }

variable "region" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "image" {
  type = string
}

variable "health_check_path" {
  type = string
}

variable "container_port" {
  type = number
}
