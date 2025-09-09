package com.cappielloantonio.tempo.service

import android.content.Context
import android.os.Bundle
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.CommandButton
import androidx.media3.session.LibraryResult
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaSession
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionResult
import com.cappielloantonio.tempo.R
import com.cappielloantonio.tempo.repository.AutomotiveRepository
import com.google.common.collect.ImmutableList
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture

open class MediaLibrarySessionCallback(
    context: Context,
    automotiveRepository: AutomotiveRepository
) :
    MediaLibraryService.MediaLibrarySession.Callback {

    init {
        MediaBrowserTree.initialize(automotiveRepository)
    }

    private val shuffleCommandButtons: List<CommandButton> = listOf(
        CommandButton.Builder()
            .setDisplayName(context.getString(R.string.exo_controls_shuffle_on_description))
            .setSessionCommand(
                SessionCommand(
                    CUSTOM_COMMAND_TOGGLE_SHUFFLE_MODE_ON, Bundle.EMPTY
                )
            ).setIconResId(R.drawable.exo_icon_shuffle_off).build(),

        CommandButton.Builder()
            .setDisplayName(context.getString(R.string.exo_controls_shuffle_off_description))
            .setSessionCommand(
                SessionCommand(
                    CUSTOM_COMMAND_TOGGLE_SHUFFLE_MODE_OFF, Bundle.EMPTY
                )
            ).setIconResId(R.drawable.exo_icon_shuffle_on).build()
    )

    private val repeatCommandButtons: List<CommandButton> = listOf(
        CommandButton.Builder()
            .setDisplayName(context.getString(R.string.exo_controls_repeat_off_description))
            .setSessionCommand(SessionCommand(CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_OFF, Bundle.EMPTY))
            .setIconResId(R.drawable.exo_icon_repeat_off)
            .build(),
        CommandButton.Builder()
            .setDisplayName(context.getString(R.string.exo_controls_repeat_one_description))
            .setSessionCommand(SessionCommand(CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_ONE, Bundle.EMPTY))
            .setIconResId(R.drawable.exo_icon_repeat_one)
            .build(),
        CommandButton.Builder()
            .setDisplayName(context.getString(R.string.exo_controls_repeat_all_description))
            .setSessionCommand(SessionCommand(CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_ALL, Bundle.EMPTY))
            .setIconResId(R.drawable.exo_icon_repeat_all)
            .build()
    )

    private val customLayoutCommandButtons: List<CommandButton> =
        shuffleCommandButtons + repeatCommandButtons

    @OptIn(UnstableApi::class)
    val mediaNotificationSessionCommands =
        MediaSession.ConnectionResult.DEFAULT_SESSION_AND_LIBRARY_COMMANDS.buildUpon()
            .also { builder ->
                (shuffleCommandButtons + repeatCommandButtons).forEach { commandButton ->
                    commandButton.sessionCommand?.let { builder.add(it) }
                }
            }.build()

    fun buildCustomLayout(player: Player): ImmutableList<CommandButton> {
        val shuffle = shuffleCommandButtons[if (player.shuffleModeEnabled) 1 else 0]
        val repeat = when (player.repeatMode) {
            Player.REPEAT_MODE_ONE -> repeatCommandButtons[1]
            Player.REPEAT_MODE_ALL -> repeatCommandButtons[2]
            else -> repeatCommandButtons[0]
        }
        return ImmutableList.of(shuffle, repeat)
    }

    @OptIn(UnstableApi::class)
    override fun onConnect(
        session: MediaSession, controller: MediaSession.ControllerInfo
    ): MediaSession.ConnectionResult {
        if (session.isMediaNotificationController(controller) || session.isAutomotiveController(
                controller
            ) || session.isAutoCompanionController(controller)
        ) {
            val customLayout = buildCustomLayout(session.player)

            return MediaSession.ConnectionResult.AcceptedResultBuilder(session)
                .setAvailableSessionCommands(mediaNotificationSessionCommands)
                .setCustomLayout(customLayout).build()
        }

        return MediaSession.ConnectionResult.AcceptedResultBuilder(session).build()
    }

    @OptIn(UnstableApi::class)
    override fun onCustomCommand(
        session: MediaSession,
        controller: MediaSession.ControllerInfo,
        customCommand: SessionCommand,
        args: Bundle
    ): ListenableFuture<SessionResult> {
        when (customCommand.customAction) {
            CUSTOM_COMMAND_TOGGLE_SHUFFLE_MODE_ON -> session.player.shuffleModeEnabled = true
            CUSTOM_COMMAND_TOGGLE_SHUFFLE_MODE_OFF -> session.player.shuffleModeEnabled = false
            CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_OFF,
            CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_ALL,
            CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_ONE -> {
                val nextMode = when (session.player.repeatMode) {
                    Player.REPEAT_MODE_ONE -> Player.REPEAT_MODE_ALL
                    Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ONE
                    else -> Player.REPEAT_MODE_OFF
                }
                session.player.repeatMode = nextMode
            }
            else -> return Futures.immediateFuture(SessionResult(SessionResult.RESULT_ERROR_NOT_SUPPORTED))
        }

        session.setCustomLayout(
            session.mediaNotificationControllerInfo!!,
            buildCustomLayout(session.player)
        )

        return Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
    }

    override fun onGetLibraryRoot(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        params: MediaLibraryService.LibraryParams?
    ): ListenableFuture<LibraryResult<MediaItem>> {
        return Futures.immediateFuture(LibraryResult.ofItem(MediaBrowserTree.getRootItem(), params))
    }

    override fun onGetChildren(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        parentId: String,
        page: Int,
        pageSize: Int,
        params: MediaLibraryService.LibraryParams?
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> {
        return MediaBrowserTree.getChildren(parentId)
    }

    override fun onAddMediaItems(
        mediaSession: MediaSession,
        controller: MediaSession.ControllerInfo,
        mediaItems: List<MediaItem>
    ): ListenableFuture<List<MediaItem>> {
        return super.onAddMediaItems(
            mediaSession,
            controller,
            MediaBrowserTree.getItems(mediaItems)
        )
    }

    override fun onSearch(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        query: String,
        params: MediaLibraryService.LibraryParams?
    ): ListenableFuture<LibraryResult<Void>> {
        session.notifySearchResultChanged(browser, query, 60, params)
        return Futures.immediateFuture(LibraryResult.ofVoid())
    }

    override fun onGetSearchResult(
        session: MediaLibraryService.MediaLibrarySession,
        browser: MediaSession.ControllerInfo,
        query: String,
        page: Int,
        pageSize: Int,
        params: MediaLibraryService.LibraryParams?
    ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> {
        return MediaBrowserTree.search(query)
    }

    companion object {
        private const val CUSTOM_COMMAND_TOGGLE_SHUFFLE_MODE_ON =
            "android.media3.session.demo.SHUFFLE_ON"
        private const val CUSTOM_COMMAND_TOGGLE_SHUFFLE_MODE_OFF =
            "android.media3.session.demo.SHUFFLE_OFF"
        private const val CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_OFF =
            "android.media3.session.demo.REPEAT_OFF"
        private const val CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_ONE =
            "android.media3.session.demo.REPEAT_ONE"
        private const val CUSTOM_COMMAND_TOGGLE_REPEAT_MODE_ALL =
            "android.media3.session.demo.REPEAT_ALL"
    }
}