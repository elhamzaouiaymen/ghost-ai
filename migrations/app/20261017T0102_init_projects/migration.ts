#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/60f1b5418e421cadd60be5b55492684c19f03a44bca1fe9b86447658fddef236/contract';
import endContract from '../../snapshots/60f1b5418e421cadd60be5b55492684c19f03a44bca1fe9b86447658fddef236/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'ProjectStatus',
        members: ['DRAFT', 'ARCHIVED'],
      }),
      this.createTable({
        schema: 'public',
        table: 'Project',
        columns: [
          col('canvasJsonPath', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ownerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', '"ProjectStatus"', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'ProjectStatus' } },
          }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ProjectCollaborator',
        columns: [
          col('createdAt', 'timestamp(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamp-string@1', typeParams: { precision: 3 } },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('projectId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_createdAt_idx',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_ownerId_idx',
        columns: ['ownerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProjectCollaborator',
        index: 'ProjectCollaborator_email_idx',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProjectCollaborator',
        index: 'ProjectCollaborator_projectId_createdAt_idx',
        columns: ['projectId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProjectCollaborator',
        index: 'ProjectCollaborator_projectId_email_key',
        columns: ['projectId', 'email'],
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ProjectCollaborator',
        foreignKey: {
          name: 'ProjectCollaborator_projectId_fkey',
          columns: ['projectId'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
