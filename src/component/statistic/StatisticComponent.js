import AgeTotalComponent from "../statistic/AgeTotalComponent";
import AgeYearComponent from "../statistic/AgeYearComponent";
import AgeQuarterComponent from "../statistic/AgeQuaterComponent";
import AgeMonthComponent from "../statistic/AgeMonthComponent";

import ProductTotalComponent from "../statistic/ProductTotalComponent";
import ProductYearComponent from "../statistic/ProductYearComponent";
import ProductQuarterComponent from "../statistic/ProductQurterComponent";
import ProductMonthComponent from "../statistic/ProductMonthComponent";




const StatisticComponent = () => {

    return (
        <div className="container mx-auto p-4">
            {/* Age Components */}
            <div className="flex justify-center mb-8">
                <AgeTotalComponent/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <AgeYearComponent/>
                <AgeQuarterComponent/>
                <AgeMonthComponent/>
            </div>

            {/* Product Components */}
            <div className="flex justify-center mb-8">
                <ProductTotalComponent/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProductYearComponent/>
                <ProductQuarterComponent/>
                <ProductMonthComponent/>
            </div>
        </div>
    );
}

export default StatisticComponent;
