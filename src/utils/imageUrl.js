/**
 * 이미지 URL 유틸리티
 * - CloudFront URL과 S3 경로를 조합하여 완전한 URL 생성
 */

/** CloudFront 기본 URL */
const CLOUDFRONT_URL = import.meta.env.VITE_CLOUDFRONT_URL

/**
 * 기업 로고 URL 생성
 */
const getCompanyLogoUrl = (logoPath) => {
  if (!logoPath) {
    return '/assets/images/admin_logo.png' // 기본 로고
  }
  
  // 이미 전체 URL인 경우
  if (logoPath.startsWith('http')) {
    return logoPath
  }
  
  // S3 경로인 경우 CloudFront URL과 조합
  return `${CLOUDFRONT_URL}${logoPath}`
}

export { getCompanyLogoUrl }