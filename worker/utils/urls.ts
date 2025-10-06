export const getProtocolForHost = (host: string): string => {
    if (host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0') || host.startsWith('::1')) {
        return 'http';
    } else {
        return 'https';
    }
}
export function getPreviewDomain(env: Env): string {
    if (env.CUSTOM_PREVIEW_DOMAIN && env.CUSTOM_PREVIEW_DOMAIN.trim() !== '') {
        return env.CUSTOM_PREVIEW_DOMAIN;
    }
    return env.CUSTOM_DOMAIN;
}

export function buildUserWorkerUrl(env: Env, deploymentId: string): string {
    const domain = getPreviewDomain(env);
    const protocol = getProtocolForHost(domain);
    return `${protocol}://${deploymentId}.${domain}`;
}

/**
 * Get the workers.dev subdomain for container instance preview URLs
 */
export function getContainerPreviewDomain(env: Env): string {
    if (env.CONTAINER_PREVIEW_SUBDOMAIN) {
        return env.CONTAINER_PREVIEW_SUBDOMAIN;
    }
    return 'srvcflo.workers.dev';
}

/**
 * Build container instance preview URL
 * Format: https://{projectName}-{instanceId}.srvcflo.workers.dev
 */
export function buildContainerPreviewUrl(env: Env, projectName: string, instanceId: string): string {
    const domain = getContainerPreviewDomain(env);
    return `https://${projectName}-${instanceId}.${domain}/`;
}