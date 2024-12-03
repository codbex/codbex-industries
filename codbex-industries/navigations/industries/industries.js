const navigationData = {
    id: 'industries-navigation',
    label: "Industries",
    group: "company",
    order: 400,
    link: "/services/web/codbex-industries/gen/codbex-industries/ui/industry/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }