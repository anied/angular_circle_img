export default function circleImg($timeout) {
	//TODO-- this could be more ES6-y -- use a class instead

	"ngInject";

	let directive = {};
	directive.restrict = 'E';
	directive.scope = {
		ciSrc : '@',
		ciDiameter : '@',
		ciAlt: '@',
		ciBalanceX: '@',
		ciBalanceY: '@',
		ciClass: '@'
	};
	directive.link = function (scope, elem, attrs) {
		let docfrag = document.createDocumentFragment();
		let testImg = document.createElement("img");

		testImg.src = scope.ciSrc;

		testImg.style.position = 'absolute';
	    testImg.style.opacity = 0;
	    testImg.style.top = 0;
	    testImg.style.left = 0;
	    testImg.style.margin = 0;
	    testImg.style.padding = 0;

		docfrag.appendChild(testImg);

		document.body.appendChild(docfrag);

		setTimeout(function () { // Using vanilla setTimeout bc we don't need to respect the $apply cycle for this
			//TODO this can certainly be written more cleanly
			const imgBounds = testImg.getBoundingClientRect();
			if (imgBounds.height < imgBounds.width) {
				scope.height = scope.ciDiameter;
				scope.width = imgBounds.width * (scope.ciDiameter/imgBounds.height);
			} else if (imgBounds.width < imgBounds.height) {
				scope.width = scope.ciDiameter;
				scope.height = imgBounds.height * (scope.ciDiameter/imgBounds.width);
			} else if (imgBounds.height === imgBounds.width) {
				scope.width = scope.ciDiameter;
				scope.height = scope.ciDiameter;
			}

			scope.width = parseFloat(scope.width, 10);
			scope.height = parseFloat(scope.height, 10);

			testImg.parentElement.removeChild(testImg);

			testImg = null; //Nulling it out to prevent any memory leaks-- *probably* overly cautious, as I don't *think* any reference would be held in any closures after this function completes...

			$timeout(function () {
				scope.$apply();
			});

		});

	};

	directive.template = `
		<div class="ci-wrapper" ng-style="circleImgCtl.wrapperStyle()" ng-class="ciClass">
			<img ng-src="{{ciSrc}}" alt="{{ciAlt}}" height="{{height}}" width="{{width}}" ng-style="circleImgCtl.imgStyle()">
		</div>
	`;

	directive.controller = "circleImgCtl as circleImgCtl";

	return directive;
}