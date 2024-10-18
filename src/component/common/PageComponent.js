import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import PropTypes from 'prop-types';

const PageComponent = ({ serverData, movePage }) => {

    const getItemProps = (pageNum) => ({
        variant: serverData.currentPage === pageNum ? "filled" : "text",
        color: "gray",
        onClick: () => movePage({ page: pageNum }),
    });

    return (
        <div className="flex items-center gap-4 justify-center m-6">
            <Button variant="text" className="flex items-center gap-2" onClick={() => movePage({ page: serverData.prevPage })} disabled={!serverData.prev}>
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> 이전 페이지
            </Button>

            <div className="flex items-center gap-2">
                {serverData.pageNumbers.map((pageNum) => (
                    <IconButton key={pageNum} {...getItemProps(pageNum)}>
                        {pageNum}
                    </IconButton>
                ))}
            </div>

            <Button variant="text" className="flex items-center gap-2" onClick={() => movePage({ page: serverData.nextPage })} disabled={!serverData.next}>
                다음 페이지<ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
};

//컴포넌트에 전달하는 객체에 대한 정의
PageComponent.propTypes = {
    serverData: PropTypes.object.isRequired,
    movePage: PropTypes.func.isRequired,
};


export default PageComponent;
