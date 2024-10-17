const navigationData = {
    id: 'industries-navigation',
    label: "Industries",
    view: "industries",
    group: "configurations",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-industries/gen/codbex-industries/ui/industry/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }