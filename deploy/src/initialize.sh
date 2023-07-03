## Check and set environments ##################################################

check_command aws
check_command terraform
check_command jq

# set project root
PROJECT_ROOT=$(
    cd "$(dirname "$0")/.."
    pwd
)

# set infra root
INFRA_ROOT="$PROJECT_ROOT/infrastructure"

# set v1 root
V1_ROOT="$PROJECT_ROOT/v1"
V1_OUTPUT_ROOT="$V1_ROOT/src/public"

# set v2 root
V2_ROOT="$PROJECT_ROOT/v2"
V2_OUTPUT_ROOT="$V2_ROOT/out"

# set v3 root
V3_ROOT="$PROJECT_ROOT/v3"
V3_NEXT_TAG_FILE="$PROJECT_ROOT/deploy/V3_NEXT_TAG.txt"

# avoid aws cli pager which launch less/vi
export AWS_PAGER=""