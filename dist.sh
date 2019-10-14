rm -rf ../emqx-enterprise-dashboard/priv/www/*
echo "Deleted"
cp -rf dist/* ../emqx-enterprise-dashboard/priv/www
echo "Finished"
