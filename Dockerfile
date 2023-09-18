# Docker descriptor for codbex-industries     
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.11.0

COPY codbex-industries target/dirigible/repository/root/registry/public/codbex-industries

COPY codbex-industries-data target/dirigible/repository/root/registry/public/codbex-industries-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-industries/gen/index.html
