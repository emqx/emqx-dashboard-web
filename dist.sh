rm -rf ../emqx-enterprise-dashboard/priv/www/*
echo "prive/www/* Deleted\n"
cp -rf dist/* ../emqx-enterprise-dashboard/priv/www
echo "emqx-enterprise-dashboard Deployed\n"
