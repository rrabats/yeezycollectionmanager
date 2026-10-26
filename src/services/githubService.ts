import { GITHUB_API, GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO } from '../config/github'
import { decodeBase64Utf8, encodeBase64Utf8 } from '../utils/base64'

export class GitHubError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'GitHubError'
    this.status = status
  }

  /** The file changed on GitHub since we read it (someone else saved first). */
  get isConflict(): boolean {
    return this.status === 409 || this.status === 422
  }

  get isAuthProblem(): boolean {
    return this.status === 401 || this.status === 403 || this.status === 404
  }
}

export interface RepoFile {
  text: string
  sha: string
}

function headers(token: string | null): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request<T>(path: string, token: string | null, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: { ...headers(token), ...init.headers },
  })
  if (!res.ok) {
    let message = `GitHub returned HTTP ${res.status}`
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // keep the generic message
    }
    throw new GitHubError(res.status, message)
  }
  return res.json() as Promise<T>
}

const repoPath = `/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

/** Reads a file from the repo. Works without a token because the repo is public. */
export async function readFile(path: string, token: string | null): Promise<RepoFile> {
  const file = await request<{ content: string; sha: string }>(
    `${repoPath}/contents/${path}?ref=${GITHUB_BRANCH}`,
    token,
  )
  return { text: decodeBase64Utf8(file.content), sha: file.sha }
}

/** Commits a new version of a file. `sha` must be the version it replaces, or GitHub rejects it. */
export async function writeFile(
  path: string,
  text: string,
  sha: string,
  message: string,
  token: string,
): Promise<RepoFile> {
  const result = await request<{ content: { sha: string } }>(`${repoPath}/contents/${path}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: encodeBase64Utf8(text), sha, branch: GITHUB_BRANCH }),
  })
  return { text, sha: result.content.sha }
}

/** Checks that the token can see the repo and returns the GitHub username it belongs to. */
export async function verifyToken(token: string): Promise<string> {
  await request(repoPath, token)
  const user = await request<{ login: string }>('/user', token)
  return user.login
}
