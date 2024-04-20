import { Injectable } from "@angular/core";
@Injectable()
export class PaginationService {

    getPaginator(totalItems: number, currentPage = 1, pageSize = 10) {

        const totalPages = Math.ceil(totalItems / pageSize);
        const startPage = 1;
        let endPage: number = totalPages;

        if (currentPage < 1) {
            currentPage = 1;
            endPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }
}
