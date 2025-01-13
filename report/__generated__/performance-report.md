# HTML Comments Performance Test Results
> Generated on 2025-02-21 at 13:39:11

This report compares the performance metrics of HTML pages with varying amounts of comments across desktop and mobile devices.

## Desktop Performance Comparison

| File | Performance Score | FCP (ms) | LCP (ms) | TBT (ms) | Speed Index | TTI (ms) |
|------|------------------|-----------|-----------|-----------|-------------|-----------|
| with-huge-comments.html | 91.0% | 2605 | 2929 | 0 | 2605 | 2929 |
| with-medium-comments.html | 85.0% | 3047 | 3519 | 0 | 3047 | 3519 |
| with-normal-comments.html | 85.0% | 3093 | 3516 | 0 | 3093 | 3516 |
| without-comments.html | 85.0% | 3095 | 3527 | 0 | 3095 | 3527 |

## Mobile Performance Comparison

| File | Performance Score | FCP (ms) | LCP (ms) | TBT (ms) | Speed Index | TTI (ms) |
|------|------------------|-----------|-----------|-----------|-------------|-----------|

## Metrics Explanation
- **Performance Score**: Overall Lighthouse performance score (0-100)
- **FCP (First Contentful Paint)**: Time when the first content appears
- **LCP (Largest Contentful Paint)**: Time when the largest content element becomes visible
- **TBT (Total Blocking Time)**: Sum of all time periods where the main thread was blocked
- **Speed Index**: How quickly the page contents are visually populated
- **TTI (Time to Interactive)**: Time until the page becomes fully interactive

## Analysis

The results show the impact of HTML comments on page performance across different scenarios and devices:
- `with-huge-comments.html`: Page with extensive comments
- `with-medium-comments.html`: Page with moderate amount of comments
- `with-normal-comments.html`: Page with typical amount of comments
- `without-comments.html`: Page with no comments

### Testing Conditions
- **Desktop**: 1350x940 viewport, no throttling
- **Mobile**: 360x640 viewport with mobile emulation, 4G throttling

Lower values indicate better performance for all metrics except Performance Score.