#!/bin/bash

set -e

valid_services=(
    "web"
    "db"
)

select service in "${valid_services[@]}" "Cancel"; do
  case $service in
    "web")
        docker-compose -f docker-compose-dev.yml exec web /bin/bash
        exit 0
      ;;
    "db")
        docker-compose -f docker-compose-dev.yml exec db mongo
        exit 0
      ;;
    "Cancel")
        echo "Cancelled"
        exit 0
      ;;
    *)
        echo "Invalid option selected. Pick one of the numbers listed."
      ;;
  esac
done
